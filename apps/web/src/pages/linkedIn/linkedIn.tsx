import { UserCard } from "@/components/cards/user";
import { useLinkedInProfile } from "./query";
import { CenterSpinner } from "@/components/ui/center-spinner";

export const LinkedInPage = ({ alias }: { alias: string }) => {
  const { data, isFetching } = useLinkedInProfile(alias);
  console.log({ alias });
  if (isFetching && !data) {
    return <CenterSpinner />;
  }

  const name = data?.profile?.firstName + " " + data?.profile?.lastName;
  const title = data?.profile?.headline ?? "";
  const hero = `${data?.profile?.backgroundPicture?.displayImageReference?.vectorImage.rootUrl}${data?.profile?.backgroundPicture.displayImageReference?.vectorImage.artifacts[1].fileIdentifyingUrlPathSegment}`;
  const avatarImage = `${data?.profile?.profilePicture?.displayImageReference?.vectorImage.rootUrl}${data?.profile?.profilePicture?.displayImageReference?.vectorImage?.artifacts[1].fileIdentifyingUrlPathSegment}`;
  return (
    <UserCard
      name={name}
      title={title}
      avatarImage={avatarImage}
      heroImage={hero}
    />
  );
};
