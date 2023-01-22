import React, { useRef, useState } from "react";
import { Flex, Heading, Input, Button, Box, useToast, Image } from "@chakra-ui/react";
import ShowOutput from "./ShowOutput";
import { createWorker } from "tesseract.js";

const ImageToText = () => {
  const [outText, setOutText] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [ocrLoad, setOcrLoad] = useState<boolean>(false);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const worker: Tesseract.Worker = createWorker({
    logger: (m) => console.log(m),
  });
  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(fileUrl);
    setOutText(text);
    setOcrLoad(false);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e: React.FormEvent) => {
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
        setFileUrl(data.data.display_url);
      }
    } catch (error) {
      setOutText("Network : : " + error);
    }
  };
  const handleConvert: React.MouseEventHandler<HTMLButtonElement> = () => {
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
      <Flex p={5} gap={5} w={"380px"} justifyContent={"center"} alignItems={"center"} direction={"column"} boxShadow="2xl" borderRadius={8}>
        <Input ref={inputRef} onChange={handleChange} accept="image/png, image/jpg, image/jpeg" display={"none"} type={"file"} />
        <Flex gap={2}>
          <Button bgColor={"#00B0E8"} onClick={() => inputRef?.current?.click()}>
            Select Image
          </Button>
          <Button isDisabled={fileUrl ? false : true} bgColor={"#00DF0A"} onClick={handleConvert}>
            Convert
          </Button>
        </Flex>
        <ShowOutput imgSrc={fileUrl} outText={outText} load={ocrLoad} />
      </Flex>
      <Image src={"https://user-images.githubusercontent.com/112304655/213923243-fad2fa94-b415-4712-9ae0-7ff847f5f099.svg"} alt={"Hello"} />
    </Flex>
  );
};

export default ImageToText;
