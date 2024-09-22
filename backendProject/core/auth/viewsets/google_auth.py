from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from core.author.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from core.author.serializers import UserSerializer

class LoginGoogleViewSet(ViewSet):
    permission_classes = (AllowAny,)
    http_method_names = ["post",]

    def create(self, request, *args, **kwargs):
        token = request.data.get('token')

        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Vérification du token Google
            id_info = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)

            if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Récupération de l'adresse e-mail et de l'identifiant Google
            email = id_info['email']
            google_id = id_info['sub']
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')

            # Création d'un username par défaut si nécessaire
            username = email.split('@')[0]

            # Vérification si l'utilisateur existe déjà
            user, created = User.objects.get_or_create(
                email=email, 
                defaults={
                    'username': username, 
                    'first_name': first_name, 
                    'last_name': last_name,
                    'status_choice': 'autre'  # Assurez-vous d'assigner un statut par défaut approprié
                }
            )

            if created:
                user.set_unusable_password()
                user.save()

            # Génération des tokens d'accès et de rafraîchissement
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            serializer = UserSerializer(user, context={"request": request})

            return Response({
                "user": serializer.data,
                "access": access_token,
                "refresh": refresh_token
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
