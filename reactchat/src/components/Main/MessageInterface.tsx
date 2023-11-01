import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";
import { useParams } from "react-router-dom";
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

import MessageInterfaceChannels from './MessageInterfaceChannels';

interface ServerChannelProps {
  data: Server[]
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageInterface = (props: ServerChannelProps) => {
  const { data } = props;
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const { serverId, channelId } = useParams();
  const server_name = data?.[0]?.name ?? "Server";
  const { fetchData } = useCrud<Server>(
    [],
    `messages/?channel_id=${channelId}`
  );

  const socketUrl = channelId
    ? `ws://127.0.0.1:8000/${serverId}/${channelId}`
    : null;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected!!!");
      } catch (error) {
        console.log(error);
      }
    },
    onClose: () => {
      console.log("Closed!");
    },
    onError: () => {
      console.log("Error!");
    },
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
    },
  });

  return (
    <>
      <MessageInterfaceChannels data={data} />
      {
        channelId === undefined ? (
          <Box
            sx={{
              overflow: "hidden",
              p: { xs: 0 },
              height: `calc(80vh)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                letterSpacing={"-0.5px"}
                sx={{ px: 5, maxWidth: '600px' }}
              >
                Welcome to {server_name}
              </Typography>
              <Typography>
                {data?.[0]?.description ?? "this is our home"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ overflow: "hidden", p: 0, height: `calc(100vh - 100px)` }}>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {newMessage.map((msg: Message, index: number) => {
                  return (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="user image" />
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "12px",
                          variant: "body2"
                        }}
                        primary={
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.primary"
                            sx={{
                              display: "inline", fontW: 600
                            }}
                          >
                            {msg.sender}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body1"
                              style={{
                                overflow: "visible",
                                whiteSpace: "normal",
                                textOverflow: "clip"
                              }}
                              sx={{
                                display: "inline",
                                lineHeight: 1.2,
                                fontWeight: 400,
                                letterSpacing: "-0.2px"
                              }}
                              component="span"
                              color="text.primary"
                            >
                              {msg.content}
                            </Typography>
                          </Box>
                        }
                      >

                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>

            </Box>

            {/* <div>
              {newMessage.map((msg: Message, index: number) => {
                return (
                  <div key={index}>
                    <p>{msg.sender}</p>
                    <p>{msg.content}</p>
                  </div>
                );
              })}
              <form>
                <label>
                  Enter Message:
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
              </form>
              <button
                onClick={() => {
                  sendJsonMessage({ type: "message", message });
                }}
              >
                Send Message
              </button>
            </div> */}
          </>
        )
      }
    </>
  );
}

export default MessageInterface;