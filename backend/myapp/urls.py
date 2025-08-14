from django.urls import path
from .views import PDFUploadView, PDFDeleteView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload-pdf/', PDFUploadView.as_view(), name='upload-pdf'),
    path('upload-pdf/<int:pk>/', PDFDeleteView.as_view(), name='delete-pdf'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)