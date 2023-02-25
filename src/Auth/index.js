import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Box className="col-6 form-widget" aria-live="polite">
        <Heading>Supabase ✖️ React ✖️ Hookstate</Heading>
        <Text my={4} textAlign="center">
          Sign in via magic link with your email below
        </Text>
        {loading ? (
          <Text>Sending magic link...</Text>
        ) : (
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleLogin} bg="green.600" color="#fff" my={4}>
              Send magic link
            </Button>
          </FormControl>
        )}
      </Box>
    </Flex>
  );
}
