import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import EmojiPickerComponent from "@/components/emoji-picker";
import { ProjectType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function EditProjectForm(props: {
  project?: ProjectType;
  onClose: () => void;
}) {
  const { onClose } = props;
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const [emoji, setEmoji] = useState(props.project?.emoji || "📊");

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Project title is required",
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.project?.name || "",
      description: props.project?.description || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: editProjectMutationFn,
  });

  const handleEmojiSelection = (emoji: string) => {
    setEmoji(emoji);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    if (isPending) return;
    const payload = {
      workspaceId: workspaceId,
      projectId: props.project?._id as string,
      data: {
        name: values.name,
        description: values.description,
        emoji: emoji,
      },
    };
    mutate(payload, {
      onSuccess: (data) => {
        toast({
          title: "Project updated",
          description: data.message,
          duration: 2000,
          variant: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["singleProject", props.project?._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["allProjects", workspaceId],
        });
        setTimeout(() => onClose(), 2000);
      },
      onError: (error) => {
        console.log(error);
        onClose();
        toast({
          title: "Error",
          description: error.message,
          duration: 2000,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Edit Project
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Update the project details to refine task management
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Emoji
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-normal size-[60px] !p-2 !shadow-none mt-2 items-center rounded-full "
                  >
                    <span className="text-4xl">{emoji}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" !p-0">
                  <EmojiPickerComponent onSelectEmoji={handleEmojiSelection} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Project title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" className="!h-[48px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Project description
                      <span className="text-xs font-extralight ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Projects description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isPending}
              className="flex place-self-end  h-[40px] text-white font-semibold"
              type="submit"
            >
              Update
              {isPending && <Loader className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
