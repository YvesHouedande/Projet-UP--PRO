
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('upload'):
        uploaded_file = request.FILES['upload']
        file_name = default_storage.save(uploaded_file.name, uploaded_file)
        file_url = default_storage.url(file_name)
        return JsonResponse({
            'url': file_url
        })
    return JsonResponse({
        'error': 'Invalid request'
    }, status=400)

