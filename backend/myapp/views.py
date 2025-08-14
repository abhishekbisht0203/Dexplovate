from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedPDF
from .serializers import UploadedPDFSerializer

class PDFUploadView(generics.ListCreateAPIView):
    queryset = UploadedPDF.objects.all().order_by('-uploaded_at')
    serializer_class = UploadedPDFSerializer

class PDFDeleteView(generics.DestroyAPIView):
    queryset = UploadedPDF.objects.all()
    serializer_class = UploadedPDFSerializer