from rest_framework.permissions import BasePermission

# ── Role logic ────────────────────────────────────────────────────────────────
#
#   role = 'admin' → full access to everything
#   role = 'hr'    → read-only access to:
#                    dashboard, campaign table (no actions),
#                    analytics, account profile
#
# Set roles in /admin → Auth → Users → edit user → Role field
# ─────────────────────────────────────────────────────────────────────────────


class IsAdminRole(BasePermission):
    """
    Allows access only to users with role='admin'.
    Blocks HR users even for read operations on sensitive endpoints
    (e.g. platform settings, SMTP test).
    """
    message = 'Only Admin users can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'admin'
        )


class IsAdminOrHRReadOnly(BasePermission):
    """
    Admin (role='admin') — full CRUD access.
    HR    (role='hr')    — GET/HEAD/OPTIONS only.
    Others               — denied entirely.
    """
    message = 'HR accounts have read-only access.'

    SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role = getattr(request.user, 'role', None)
        if role == 'admin':
            return True
        if role == 'hr':
            return request.method in self.SAFE_METHODS
        return False
