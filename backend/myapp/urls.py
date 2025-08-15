from django.urls import path
from .views import PDFUploadView, PDFDeleteView, PDFViewView  # Make sure PDFViewView is imported

urlpatterns = [
    path('api/upload-pdf/', PDFUploadView.as_view(), name='upload-pdf'),
    path('api/delete-pdf/<int:pk>/', PDFDeleteView.as_view(), name='delete-pdf'),
    path('api/view-pdf/<int:pk>/', PDFViewView.as_view(), name='view-pdf'),  # Add this line if missing
]