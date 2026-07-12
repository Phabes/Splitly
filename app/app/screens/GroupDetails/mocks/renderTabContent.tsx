import { Button, ListItem, Typography } from "@/app/components";
import { View } from "react-native";

export const renderTabContent = (activeTab: any, styles: any) => {
  switch (activeTab) {
    case "expenses":
      return (
        <View style={styles.tabContent}>
          <View style={styles.dateHeader}>
            <Typography
              text="TODAY"
              color="text-secondary"
            />
          </View>
          <ListItem
            text="Dinner at Mario's"
            onPress={() => {}}
          >
            <View style={styles.expenseRight}>
              <Typography
                text="250.00 PLN"
                variant="body-large"
              />
              <Typography
                text="Paid by Piotr"
                variant="body-small"
                color="text-secondary"
              />
            </View>
          </ListItem>

          <View style={styles.dateHeader}>
            <Typography
              text="YESTERDAY"
              color="text-secondary"
            />
          </View>
          <ListItem
            text="Uber to Hotel"
            onPress={() => {}}
          >
            <View style={styles.expenseRight}>
              <Typography
                text="80.00 PLN"
                variant="body-large"
              />
              <Typography
                text="Paid by You"
                variant="body-small"
              />
            </View>
          </ListItem>

          <ListItem
            text="Airbnb (3 nights)"
            onPress={() => {}}
          >
            <View style={styles.expenseRight}>
              <Typography
                text="920.00 PLN"
                variant="body-large"
              />
              <Typography
                text="Paid by Anna"
                variant="body-small"
                color="text-secondary"
              />
            </View>
          </ListItem>
        </View>
      );
    case "balances":
      return (
        <View style={styles.tabContent}>
          <ListItem
            text="Anna"
            onPress={() => {}}
          >
            <Typography
              text="25.00 PLN"
              variant="body-large"
              color="text-primary"
            />
          </ListItem>
          <ListItem
            text="You"
            onPress={() => {}}
          >
            <Typography
              text="15.00 PLN"
              variant="body-large"
            />
          </ListItem>
          <View style={styles.settleUpContainer}>
            <Button
              text="Settle Up"
              variant="secondary"
              onPress={() => {}}
            />
          </View>
        </View>
      );
    case "members":
      return (
        <View style={styles.tabContent}>
          <ListItem
            text="You"
            onPress={() => {}}
          />
          <ListItem
            text="Anna"
            onPress={() => {}}
          />
          <ListItem
            text="Piotr"
            onPress={() => {}}
          />
          <ListItem
            text="Kasia"
            onPress={() => {}}
          />

          <View style={styles.addMemberContainer}>
            <Button
              text="Add more members"
              variant="secondary"
              onPress={() => {}}
            />
          </View>
        </View>
      );
  }
};

export default renderTabContent;
