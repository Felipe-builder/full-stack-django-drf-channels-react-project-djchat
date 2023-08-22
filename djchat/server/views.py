from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Server
from .schema import server_list_docs
from .serializer import ServerSerializer


# Definindo uma classe ViewSet para lidar com a listagem de servidores
class ServerListViewSet(viewsets.ViewSet):
    # Definindo o conjunto de dados a partir do modelo Server
    queryset = Server.objects.all()
    permission_classes = [IsAuthenticated]

    # Método para listar servidores com base nos parâmetros de consulta
    @server_list_docs
    def list(self, request):
        """Lista servidores com base nos parâmetros de consulta.

        Esta função lida com a listagem de servidores com base em parâmetros fornecidos na URL da `requisição`.

        - `category`: Filtrando servidores por categoria se o parâmetro estiver presente
        - `by_user`: Filtrando servidores pelo ID do usuário se a opção for selecionada
        - `qty`: Limitando o número de servidores de acordo com o valor qty
        - `by_serverid`: Filtrando servidor pelo ID do servidor se a opção for selecionada
        - `with_num_members`: Anotando o número de membros se a opção for selecionada


        Args:
            request (HttpRequest): O objeto de solicitação HTTP.

        Returns:
            Response: Uma resposta contendo os dados serializados dos servidores.

        Raises:
            AuthenticationFailed: Se a autenticação falhar ao filtrar por usuário ou ID do servidor.
            ValidationError: Se ocorrer um erro de validação durante o processo de filtragem.

        Examples:
        Para recuperar todos os servidores na categoria 'jogos' com pelo menos 5 membros, você pode fazer
        a seguinte solicitação:

            GET /servers/?category=gaming&with_num_members=true&num_members_gte=5

        Para recuperar os 10 primeiros servidores dos quais o usuário autenticado é membro, você pode fazer
        a seguinte solicitação:

            GET /servers/?by_user=true&qty=10

        """
        # Obtendo parâmetros de consulta da URL
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        # if by_user or by_serverid and not request.user.is_authenticated:
        #     raise AuthenticationFailed

        if category:
            category_obj = get_object_or_404(Category, name=category)
            self.queryset = self.queryset.filter(category=category_obj)

        if by_user:
            if by_user and request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(member=user_id)
            else:
                raise AuthenticationFailed()

        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        if qty:
            self.queryset = self.queryset[: int(qty)]

        if by_serverid:
            if not request.user.is_authenticated:
                raise AuthenticationFailed()

            try:
                self.queryset = self.queryset.filter(id=by_serverid)
                if not self.queryset.exists():
                    raise ValidationError(
                        detail=f"Server with id {by_serverid} not found"
                    )
            except ValueError:
                raise ValidationError(detail=f"Server with id {by_serverid} not found")

        # Serializando os dados dos servidores com o contexto do número de membros
        serializer = ServerSerializer(
            self.queryset, many=True, context={"num_members": with_num_members}
        )
        # Retornando os dados serializados como uma resposta
        return Response(serializer.data)
