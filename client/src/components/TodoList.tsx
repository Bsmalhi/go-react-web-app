import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";

export type Todo = {
    _id: number;
    body: string;
    completed: boolean;
}

export default function TodoList() {
	const {data: todos, isLoading} = useQuery<Todo[], Error>({
        queryKey: ["todos"],
        queryFn: async () => {
            try {
                const res = await fetch(`${BASE_URL}/todos`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                return data || [];
            } catch (error) {
                console.error("Error fetching todos:", error);
                return [];
            }
        },
    });

	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}
              bgGradient='linear(to-l,rgb(0, 8, 255),rgb(10, 211, 242))'
              bgClip='text'>
				Today's Tasks
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && todos?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All tasks completed! 🤞
					</Text>
					<img src='/go.png' alt='Go logo' width={70} height={70} />
				</Stack>
			)}
			<Stack gap={3}>
				{todos?.map((todo) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};


