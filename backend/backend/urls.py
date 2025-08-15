from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),
]

# Serve media files in both development AND production
# This is necessary for platforms like Render where DEBUG=False
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Also serve static files (good practice)
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)