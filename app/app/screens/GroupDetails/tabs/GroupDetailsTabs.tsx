import { TopTabScreen, TopTabSelector } from "@/app/components";
import { Members } from "./Members";

export const GroupDetailsTabs = () => {
  return (
    <TopTabSelector>
      <TopTabScreen
        name="Expenses"
        component={Members}
      />
      <TopTabScreen
        name="Balances"
        component={Members}
      />
      <TopTabScreen
        name="Members"
        component={Members}
      />
    </TopTabSelector>
  );
};

export default GroupDetailsTabs;
