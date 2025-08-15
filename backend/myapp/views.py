from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, Http404
from django.views import View
import os
from .models import UploadedPDF
from .serializers import UploadedPDFSerializer

class PDFUploadView(generics.ListCreateAPIView):
    queryset = UploadedPDF.objects.all().order_by('-uploaded_at')
    serializer_class = UploadedPDFSerializer

class PDFDeleteView(generics.DestroyAPIView):
    queryset = UploadedPDF.objects.all()
    serializer_class = UploadedPDFSerializer

# Add this new view for serving PDF content
class PDFViewView(View):
    def get(self, request, pk):
        try:
            pdf_obj = UploadedPDF.objects.get(pk=pk)
            
            # Get the file path
            file_path = pdf_obj.file.path
            
            # Check if file exists
            if not os.path.exists(file_path):
                raise Http404("PDF file not found on disk")
            
            # Read and serve the PDF file
            with open(file_path, 'rb') as pdf_file:
                response = HttpResponse(pdf_file.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{os.path.basename(pdf_obj.file.name)}"'
                response['Access-Control-Allow-Origin'] = '*'  # Allow CORS
                return response
                
        except UploadedPDF.DoesNotExist:
            raise Http404("PDF not found")
        except Exception as e:
            raise Http404(f"Error serving PDF: {str(e)}")