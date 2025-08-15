from django.urls import path
from .views import PDFUploadView, PDFDeleteView

urlpatterns = [
    path('api/upload-pdf/', PDFUploadView.as_view(), name='upload-pdf'),
    path('api/delete-pdf/<int:pk>/', PDFDeleteView.as_view(), name='delete-pdf'),  # More descriptive path
]