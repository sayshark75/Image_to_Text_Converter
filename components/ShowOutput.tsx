import { Flex, Image, Heading, Text, IconButton, Spinner } from "@chakra-ui/react";
import React from "react";
import { BiCopy } from "react-icons/bi";

type ShowOutputProps = {
  imgSrc: string;
  outText: string;
  load: boolean;
};

const ShowOutput = ({ imgSrc, outText, load }: ShowOutputProps) => {
  return (
    <>
      {imgSrc ? (
        <Flex gap={2} justifyContent={"center"} alignItems={"center"} direction={"column"}>
          <Flex>
            <Image w={"280px"} src={imgSrc} alt={"ImageCatched"} />
          </Flex>
          {load ? (
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          ) : (
            <>
              <Flex justifyContent={"space-between"} w={"100%"}>
                <Heading size={"lg"}>Text Output</Heading>
                <Flex>
                  <IconButton colorScheme={"blue"} icon={<BiCopy style={{ fontSize: "20px" }} />} aria-label={"hello"} />
                </Flex>
              </Flex>
              <Flex w={"100%"} border={"4px double #BBBBBB"} borderRadius={10} p={3}>
                <Text>{outText ? outText : "Select Image & Convert"}</Text>
              </Flex>
            </>
          )}
        </Flex>
      ) : (
        <Text as={"b"} fontSize={"lg"}>
          Please Select an Image
        </Text>
      )}
    </>
  );
};

export default ShowOutput;
