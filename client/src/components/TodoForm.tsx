/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";

export default function TodoForm() {
    const inputRef = useRef<HTMLInputElement>(null);
	const [newTodo, setNewTodo] = useState("");
	// const [isPending, setIsPending] = useState(false);

    const queryClient = useQueryClient();
    const { mutate: createTodo, isPending: isCreating } = useMutation({
        mutationKey: ["createTodo"],
        mutationFn: async (e:React.FormEvent) => {
            e.preventDefault();
            if (!newTodo) {
                alert("Please enter a todo");
                return;
            }
            try {
                const res = await fetch(`${BASE_URL}/todos`, {
                     method: "POST",
                    headers: {
                        "Content-Type": "application/json", 
                    },
                    body: JSON.stringify({ body: newTodo }),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Network response was not ok");
                }
                setNewTodo("");
                return data;
            } catch (error) {   
                console.error("Error creating todo:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
        onError: (error) => {
            console.error("Error creating todo:", error);
        }
    });
	return (
		<form onSubmit={createTodo}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					// ref={(input) => input && input.focus()}
                    ref={inputRef}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};