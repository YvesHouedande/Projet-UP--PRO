from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from core.author.models import User


class SendValidationCodeToEmailViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        user = User.objects.get(public_id=request.user.public_id)
        email = request.data.get('email')

        if not email:
            return Response({"error": "Email requis."}, status=status.HTTP_400_BAD_REQUEST)

        user.inp_mail = email

        if not email.endswith('@inphb.ci'):
            return Response(
                {"error": "Vous devez avoir une adresse email @inphb.ci pour faire des publications."},
                status=status.HTTP_403_FORBIDDEN
            )

        user.save()
        user.send_validation_email()
        return Response({"message": "Code de validation envoyé avec succès."}, status=status.HTTP_200_OK)


class ValidateEmailCodeViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        user = User.objects.get(public_id=request.user.public_id)
        code = request.data.get('code')

        if not code:
            return Response({"error": "Code de validation requis."}, status=status.HTTP_400_BAD_REQUEST)

        if code == str(user.validation_code):
            user.from_inp = True  # Activer l'attribut `from_inp`
            user.validation_code = ''  # Réinitialiser le code de validation
            user.save()
            return Response({"message": "Email INP validé avec succès."}, status=status.HTTP_200_OK)

        return Response({"error": "Code de validation incorrect."}, status=status.HTTP_400_BAD_REQUEST)
