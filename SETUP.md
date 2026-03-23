# PhishingOps Backend — Setup Guide

## Project Structure

```
Backend/
├── manage.py
├── requirements.txt
├── .env.example             ← copy to .env and fill in
├── phishingOperations/      ← Django project config
│   ├── settings.py
│   ├── urls.py
│   ├── celery.py
│   └── wsgi.py
├── apps/                    ← Django apps (models + admin)
│   ├── campaigns/
│   │   ├── models.py        ← EmailTemplate, Campaign, CampaignTarget
│   │   ├── admin.py         ← Django admin registration
│   │   ├── tasks.py         ← Celery email-sending tasks
│   │   ├── tracking_views.py ← /go/<uuid>/ phishing click handler
│   │   └── tracking_urls.py
│   ├── lms/
│   │   ├── models.py        ← Course, Lesson, Quiz, QuizQuestion, QuizChoice
│   │   └── admin.py
│   └── settings_app/
│       ├── models.py        ← Platform Settings, SMTP Email Test
│       └── admin.py
└── api/                     ← REST API layer
    ├── serializers.py       ← DRF serializers
    ├── views.py             ← DRF ViewSets + APIViews
    └── urls.py              ← DRF Router + urlpatterns
```

---

## First-time Setup

### 1. Create and activate virtual environment
```cmd
cd Backend
python -m venv venv
venv\Scripts\activate
```

### 2. Install dependencies
```cmd
pip install -r requirements.txt
```

### 3. Create .env file
```cmd
copy .env.example .env
```
Edit `.env` — at minimum set `DB_PASSWORD`.

### 4. Create PostgreSQL database (run once)
```sql
-- In psql as postgres user:
CREATE DATABASE phishingopsdatabase;
CREATE USER phishingopsuser WITH PASSWORD 'mypassword';
ALTER ROLE phishingopsuser SET client_encoding TO 'utf8';
ALTER ROLE phishingopsuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE phishingopsuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE phishingopsdatabase TO phishingopsuser;

-- Connect to the database then:
\c phishingopsdatabase
GRANT ALL ON SCHEMA public TO phishingopsuser;
ALTER DATABASE phishingopsdatabase OWNER TO phishingopsuser;
ALTER SCHEMA public OWNER TO phishingopsuser;
```

### 5. Run migrations
```cmd
python manage.py makemigrations campaigns
python manage.py makemigrations lms
python manage.py makemigrations settings_app
python manage.py migrate
```

### 6. Create superuser (for /admin panel)
```cmd
python manage.py createsuperuser
```
Use whatever username/password you want. This account logs into `/admin`.

### 7. Run the server
```cmd
python manage.py runserver
```

### 8. Open a second terminal for asynchronous tasks
```cmd
cd Backend
venv\Scripts\activate
python manage.py qcluster
```

---

## Django Admin Panel

Visit: http://127.0.0.1:8000/admin/

Log in with your superuser credentials. From here you can:
- **Email Templates** — create/edit/delete phishing email templates
- **Campaigns** — create/manage campaigns, assign templates and courses, view stats
- **Campaign Targets** — add/edit/remove targets, see tracking data
- **Courses / Lessons / Quizzes** — manage LMS content
- **Users** — manage Django user accounts

---

## API Endpoints

All endpoints are under `/api/v1/`.

### Auth
| Method | URL | Description |
|---|---|---|
| POST | `/api/v1/auth/login/` | Login → JWT tokens |
| POST | `/api/v1/auth/refresh/` | Refresh access token |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token |
| GET  | `/api/v1/auth/me/` | Current user info |
| PATCH | `/api/v1/auth/me/` | Update profile |

### Email Templates
| Method | URL | Description |
|---|---|---|
| GET/POST | `/api/v1/templates/` | List / create |
| GET/PATCH/DELETE | `/api/v1/templates/<id>/` | Retrieve / update / delete |

### Campaigns
| Method | URL | Description |
|---|---|---|
| GET/POST | `/api/v1/campaigns/` | List / create |
| GET/PATCH/DELETE | `/api/v1/campaigns/<id>/` | Retrieve / update / delete |
| POST | `/api/v1/campaigns/<id>/launch/` | Launch campaign |
| POST | `/api/v1/campaigns/<id>/pause/` | Pause campaign |
| POST | `/api/v1/campaigns/<id>/complete/` | Mark complete |

### Targets
| Method | URL | Description |
|---|---|---|
| GET/POST | `/api/v1/campaigns/<id>/targets/` | List / add single |
| PATCH/DELETE | `/api/v1/campaigns/<id>/targets/<id>/` | Edit / remove |
| POST | `/api/v1/campaigns/<id>/targets/upload_csv/` | Bulk CSV upload |
| GET | `/api/v1/targets/` | All targets (user management) |

### Courses
| Method | URL | Description |
|---|---|---|
| GET/POST | `/api/v1/courses/` | List / create (POST: staff only) |
| GET/PATCH/DELETE | `/api/v1/courses/<id>/` | Retrieve / update / delete |

### LMS (no login required — token-gated)
| Method | URL | Description |
|---|---|---|
| POST | `/api/v1/lms/session/` | Start LMS session from phishing token |
| POST | `/api/v1/lms/lessons/<id>/complete/` | Mark lesson complete |
| POST | `/api/v1/lms/quiz/<id>/submit/` | Submit quiz answers |

### Analytics
| Method | URL | Description |
|---|---|---|
| GET | `/api/v1/dashboard/` | Dashboard stats |
| GET | `/api/v1/analytics/` | Full analytics |
| GET | `/api/v1/analytics/campaigns/<id>/export/` | Export campaign CSV |
| GET | `/api/v1/analytics/export/` | Export all targets CSV |
| GET | `/api/v1/analytics/quiz-attempts/` | All quiz attempts |

---

## On a new device (cloned from Git)

The `.env` file is in `.gitignore` and is NOT committed.
Every device needs its own:

```cmd
copy .env.example .env
# Fill in DB_PASSWORD and generate FIELD_ENCRYPTION_KEY
```

Generate FIELD_ENCRYPTION_KEY:
```cmd
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
