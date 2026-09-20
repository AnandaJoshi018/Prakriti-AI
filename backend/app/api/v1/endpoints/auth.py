"""Authentication endpoints."""

from typing import Annotated

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.security import create_access_token, hash_password, verify_password
from app.core.config import get_settings
from app.core.database import get_db
from app.core.exceptions import AppError, UnauthorizedError
from app.models import User
from app.schemas.auth import GoogleLoginRequest, TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter()

# Google's userinfo endpoint — returns verified user info from a valid access token
_GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    payload: UserRegister,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise AppError("Email already registered", status_code=409)

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    # Issue JWT immediately so the frontend can authenticate without a second login step.
    token = create_access_token(user.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: UserLogin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.hashed_password or ""):
        raise UnauthorizedError("Invalid email or password")

    token = create_access_token(user.email)
    return TokenResponse(access_token=token)


@router.post("/google", response_model=TokenResponse)
async def google_login(
    payload: GoogleLoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """Exchange a Google OAuth access token for a PrakritiAI JWT.

    The Google access token is verified by calling Google's own userinfo
    endpoint — Google rejects invalid or expired tokens, so we never trust
    unverified client-side data.  After verification the flow is identical to
    a normal email/password login: find-or-create a local User row and issue
    the existing JWT via create_access_token().

    No Google Client Secret is required for this flow, making it safe for
    SPA (Single-Page Application) deployments.
    """
    settings = get_settings()
    if not settings.google_client_id:
        raise AppError("Google authentication is not configured on this server", status_code=503)

    # Verify the Google access token by calling Google's userinfo API.
    # Google will reject the call if the token is expired, revoked, or forged.
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                _GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {payload.access_token}"},
                timeout=10.0,
            )
        except httpx.RequestError as exc:
            raise AppError("Could not reach Google's authentication service. Please try again.") from exc

    if resp.status_code != 200:
        raise UnauthorizedError("Google token verification failed. Please sign in with Google again.")

    user_info: dict = resp.json()

    email: str | None = user_info.get("email")
    if not email:
        raise UnauthorizedError("Google account has no email address associated with it.")

    if not user_info.get("email_verified", False):
        raise UnauthorizedError("Your Google email address is not verified. Please verify it with Google first.")

    full_name: str = user_info.get("name") or email.split("@")[0]

    # Find an existing user or create a new one — no duplicates ever created
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        # New Google user — create a local account with no password hash
        user = User(
            email=email,
            full_name=full_name,
            hashed_password=None,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)

    # Issue the standard PrakritiAI JWT — completely unchanged from password flow
    token = create_access_token(user.email)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user
