import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useGlobalState } from "./store";
import { supabase } from "./config/supabaseClient";
import Auth from "./Auth";

const App = () => {
  const [session, setSession] = useState(null);
  const state = useGlobalState();
  const [blog, setBlog] = useState([]);

  const [content, setContent] = useState("");
  const [edit, setEdit] = useState(false);
  const [updateId, setUpdateId] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBlogs = () => {
    state.getBlogs();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBlogs = () => {
    setBlog(state.fetchBlogs());
  };

  useEffect(() => {
    loadBlogs();
    fetchBlogs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBlog = async () => {
    state.addBlog(content, session);
    setContent("");
  };

  const updateBlog = (id) => {
    state.updateBlog(id, session, content);
    setContent("");
    setUpdateId(0);
    setEdit(false);
  };

  const deleteBlog = (id) => {
    state.deleteBlog(id, session);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      window.location.reload();
    }
  };

  if (state.errorMsg() !== null) {
    alert(state.errorMsg());
    state.clearErrorMsg();
  }

  if (state.success() !== null) {
    loadBlogs();
    fetchBlogs();
    alert(state.success());
    state.clearSuccess();
  }

  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          maxW="1440px"
          minH="100vh"
          m="auto"
        >
          <Box
            width={{ base: "auto", md: "700px" }}
            minH="100vh"
            mt="0rem"
            bg={{ base: "transparent", md: "blackAlpha.400" }}
            p={8}
          >
            <Text fontSize="28px" fontWeight="600" mb={4}>
              Welcome, {session.user.email}
            </Text>
            <Button onClick={signOut} color="#fff" bg="red">
              Sign out
            </Button>
            <Text fontSize="28px" fontWeight="600" mb={4}>
              Blog posts: {state.getBlogCount()}
            </Text>
            <Flex>
              <Input
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                errorBorderColor="crimson"
                placeholder="Enter Quote"
                borderInlineEndRadius={0}
              />
              {edit ? (
                <Button
                  onClick={() => updateBlog(updateId)}
                  borderInlineStartRadius={0}
                  bg="green"
                  color="#fff"
                >
                  Update
                </Button>
              ) : (
                <Button
                  isDisabled={content.length < 4}
                  onClick={addBlog}
                  borderInlineStartRadius={0}
                  bg="green"
                  color="#FFF"
                >
                  Add
                </Button>
              )}
            </Flex>
            <Box my={8}>
              {blog.length < 1 && (
                <Text py={4} textAlign="center">
                  No blog post found
                </Text>
              )}
              {blog &&
                blog.map((item, index) => (
                  <Card
                    key={index}
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                    variant="outline"
                    my={4}
                  >
                    <Stack w="full">
                      <CardBody>
                        <Text fontSize="24px" fontWeight="600" py="2">
                          {item.get(item).content}
                        </Text>
                      </CardBody>

                      <CardFooter
                        display="flex"
                        justifyContent="flex-end"
                        gap={4}
                      >
                        <Button
                          onClick={() => {
                            setContent(item.get(item).content);
                            setEdit(true);
                            setUpdateId(item.get(item).id);
                          }}
                          bg="blue"
                          color="#fff"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteBlog(item.get(item).id)}
                          bg="red"
                          color="#fff"
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Stack>
                  </Card>
                ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default App;
