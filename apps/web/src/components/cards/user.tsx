import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type UserCardProps = {
  heroImage: string;
  avatarImage: string;
  name: string;
  title: string;
};

export function UserCard({
  heroImage,
  avatarImage,
  name,
  title,
}: UserCardProps) {
  return (
    <Card className="dark:border-none border-none">
      <div className="flex flex-col gap-4 content-center relative h-[200px]">
        <img src={heroImage} className="h-[140px] w-full object-cover" />
        <Avatar className="h-[110px] w-[110px] absolute top-[80px] left-1/2 transform -translate-x-1/2 border-2">
          <AvatarImage src={avatarImage} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col content-center text-center gap-1">
        <p className="text-lg font-medium leading-none">{name}</p>
        <p className="text-md text-muted-foreground">{title}</p>
      </div>

      <div className="flex items-center justify-center mt-3 gap-3">
        <Button
          color="primary"
          variant="outline"
          size="lg"
          className="flex w-[100px] h-[40px] rounded-md"
        >
          Message
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex w-[100px] h-[40px] rounded-md"
        >
          Export <ExternalLink />
        </Button>
      </div>
    </Card>
  );
}
