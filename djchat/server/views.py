from django.db.models import Count
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response

from .models import Server
from .serializer import ServerSerializer


# Definindo uma classe ViewSet para lidar com a listagem de servidores
class ServerListViewSet(viewsets.ViewSet):
    # Definindo o conjunto de dados a partir do modelo Server
    queryset = Server.objects.all()

    # Método para listar servidores com base nos parâmetros de consulta
    def list(self, request):
        # Obtendo parâmetros de consulta da URL
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        # Verificando autenticação se a listagem é filtrada por usuário ou ID do servidor
        if by_user or by_serverid and not request.user.is_authenticated:
            raise AuthenticationFailed

        # Filtrando servidores por categoria se o parâmetro estiver presente
        if category:
            self.queryset = self.queryset.filter(category_name=category)

        # Filtrando servidores pelo ID do usuário se a opção for selecionada
        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        # Anotando o número de membros se a opção for selecionada
        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        # Limitando o número de servidores de acordo com o valor qty
        if qty:
            self.queryset = self.queryset[: int(qty)]

        # Filtrando servidor pelo ID do servidor se a opção for selecionada
        if by_serverid:
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
