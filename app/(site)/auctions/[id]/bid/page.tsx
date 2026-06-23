import { redirect } from "next/navigation";

type LegacyBidPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyBidPageRedirect({
  params,
}: LegacyBidPageProps) {
  const { id } = await params;
  redirect(`/auctions/${id}`);
}
