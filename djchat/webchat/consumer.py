from channels.generic.websocket import WebsocketConsumer


class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        print(text_data)
        self.send(text_data="This is a reply from the server")
        # self.close()

    def disconnect(self, close_code):
        pass
