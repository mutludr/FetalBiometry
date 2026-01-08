import { createFileRoute } from "@tanstack/react-router";
import { PregnancyTracker } from "@/components/pregnancy";
import { listPregnantWomenFn } from "@/server/functions/pregnant-women";

export const Route = createFileRoute("/_public/")({
  loader: async () => {
    try {
      const result = await listPregnantWomenFn();
      return {
        pregnantWomen: result.pregnantWomen,
      };
    } catch {
      // User not authenticated, return empty list
      return {
        pregnantWomen: [],
      };
    }
  },
  component: Index,
});

function Index() {
  const { currentUser } = Route.useRouteContext();
  const { pregnantWomen } = Route.useLoaderData();

  return (
    <PregnancyTracker initialWomen={pregnantWomen} currentUser={currentUser} />
  );
}
