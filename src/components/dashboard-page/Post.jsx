import * as React from "react";
import { Typography, Grid } from "@mui/material";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import Comment from "./Comment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";


const Post = ({ title, date, comments}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();  

  return (
    <React.Fragment>
      <Grid item xs={12} md={4} lg={10}>
        <div className="flex-row  bg-white cursor-pointer hover:bg-green-100 rounded-lg border">
          <div className="flex p-2">
            <div className="p-2 m-1 rounded-3xl bg-green-600">
              <ClassOutlinedIcon
                style={{ color: "white" }}
                // sx={{ display: "inline-flex" }}
              />
            </div>
            <div className="ml-5">
              <Typography>
                Khanh Huy Nguyen posted a new document: {title}{" "}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                {date}
              </Typography>
            </div>
          </div>

          <div
            onClick={onOpen}
            className="px-4 py-2 border-t text-sm hover:underline hover:text-green-600">
            4 comments about the class
          </div>
          <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Classroom comments
                  </ModalHeader>
                  <ModalBody>
                    <Comment
                      userName="John Doe"
                      date="December 3"
                      content="This is a sample comment."
                    />                    
                    {/* {comments.map((cmt) => (
                      <Comment
                        key={key}
                        userName={cmt.userName}
                        date={cmt.date}
                        content={cmt.content}
                      />
                    ))} */}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default Post;
