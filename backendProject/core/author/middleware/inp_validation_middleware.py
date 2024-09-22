from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

def check_inphb_email(get_response):
    def middleware(request):
        # Vérifier si l'endpoint et la méthode HTTP correspondent à l'action de post
        if request.path == '/api/general_post/' and request.method == 'POST':
            # Tenter d'authentifier l'utilisateur avec le JWT
            user_auth = JWTAuthentication().authenticate(request)
             
            if user_auth is not None:
                user, _ = user_auth
                
                # Si l'utilisateur est authentifié, vérifier son email
                if not user.inp_mail or not user.inp_mail.endswith('@inphb.ci'):
                    return JsonResponse(
                        {"error": "Vous devez avoir une adresse email @inphb.ci pour faire des publications."},
                        status=403
                    )
        
        # Si l'utilisateur n'est pas authentifié ou l'endpoint n'est pas concerné, laisser passer
        return get_response(request)

    return middleware
