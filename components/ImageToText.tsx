import React, { useRef, useState } from "react";
import { Flex, Heading, Input, Button, Box, useToast } from "@chakra-ui/react";
import ShowOutput from "./ShowOutput";
import { createWorker } from "tesseract.js";

const ImageToText = () => {
  const [outText, setOutText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [ocrLoad, setOcrLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789",
    });
    const {
      data: { text },
    } = await worker.recognize(fileUrl);
    setOutText(text);
    setOcrLoad(false);
  };

  const handleChange = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      if (inputRef != null) {
        const myUrl = inputRef!.current!.files[0];
        let formData = new FormData();
        formData.append("image", myUrl);
        let res = await fetch("https://api.imgbb.com/1/upload?expiration=600&key=c17fb71a1a4eb8f95032fe46cee4de81", {
          method: "POST",
          body: formData,
        });
        let data = await res.json();
        console.log(data);
        setLoading(false);
        setFileUrl(data.data.display_url);
      }
    } catch (error) {
      setOutText("Network : : " + error);
    }
  };
  const handleConvert = () => {
    if (fileUrl) {
      setOcrLoad(true);
      doOCR();
    } else {
      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="green.500">
            File_Url is Invalid
          </Box>
        ),
      });
    }
  };

  return (
    <Flex direction={"column"} justifyContent={"flex-start"} w={"100%"} h={"100vh"} alignItems={"center"}>
      <Heading size={"lg"} my={8} color={"blue.500"}>
        Image To Text Converter
      </Heading>
      <Flex p={5} gap={5} w={"380px"} justifyContent={"center"} alignItems={"center"} direction={"column"} boxShadow="dark-lg" borderRadius={8}>
        <Input ref={inputRef} onChange={handleChange} accept="image/png, image/jpg, image/jpeg" display={"none"} type={"file"} />
        <Flex gap={2}>
          <Button colorScheme={"blue"} onClick={() => inputRef?.current?.click()}>
            Select Image
          </Button>
          <Button disabled={loading} colorScheme={"green"} onClick={handleConvert}>
            Convert
          </Button>
        </Flex>
        <ShowOutput imgSrc={fileUrl} outText={outText} load={ocrLoad} />
      </Flex>
    </Flex>
  );
};

export default ImageToText;
