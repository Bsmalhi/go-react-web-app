import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";


const TodoItem = ({ todo }: { todo: Todo }) => {
    const queryClient = useQueryClient();
    const {mutate: updateTodo, isPending: isUpdating} = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async (todo: Todo) => {
            if(todo.completed){
                return alert("Todo already completed!");
            }
            try {
                const res = await fetch(`${BASE_URL}/todos/${todo._id}`, {
                    method: "PATCH",
                });
                const data = await res.json();
                if(!res.ok) {
                    throw new Error(data.error || "Network response was not ok");
                }
                return data;
            } catch (error) {
                console.error("Error updating todo:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["todos"]});
        },
        onError: (error) => {
            console.error("Error updating todo:", error);
        }
    });
    const {mutate: deleteTodo, isPending: isDeleting} = useMutation({
        mutationKey: ["deleteTodo"],
        mutationFn: async (todo: Todo) => {
            console.log("Deleting: " + todo);
            try{
                const res = await fetch(`${BASE_URL}/todos/${todo._id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if(!res.ok) {
                    throw new Error(data.error || "Network response was not ok");
                }
                return data;
            }
            catch (error) {
                console.error("Error deleting todo:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["todos"]});
        },
    });
	return (
		<Flex gap={2} alignItems={"center"}>
			<Flex
				flex={1}
				alignItems={"center"}
				border={"1px"}
				borderColor={"gray.600"}
				p={2}
				borderRadius={"lg"}
				justifyContent={"space-between"}
			>
				<Text
					color={todo.completed ? "green.200" : "yellow.100"}
					textDecoration={todo.completed ? "line-through" : "none"}
				>
					{todo.body}
				</Text>
				{todo.completed && (
					<Badge ml='1' colorScheme='green'>
						Done
					</Badge>
				)}
				{!todo.completed && (
					<Badge ml='1' colorScheme='yellow'>
						In Progress
					</Badge>
				)}
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Box color={"green.500"} cursor={"pointer"} onClick={() => updateTodo(todo)}>
					{!isUpdating && <FaCheckCircle size={20} />}
                    {isUpdating && <Spinner size={"sm"} />}
				</Box>
				<Box color={"red.500"} cursor={"pointer"} onClick={() => deleteTodo(todo)}>
					{!isDeleting && <MdDelete size={25} />}
                    {isDeleting && <Spinner size={"sm"} />}
				</Box>
			</Flex>
		</Flex>
	);
};
export default TodoItem;