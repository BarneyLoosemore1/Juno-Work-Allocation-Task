import fs from "fs";

type DoableType = "email" | "task";
type User = {
  user_name: string;
  preferred_doable_type: DoableType | null;
};
type Doable = {
  id: string;
  title: string;
  case_id: string;
  type: DoableType;
  created_at: string;
};
type Case = {
  case_id: string;
  doables: Doable[];
};

export class WorkAllocator {
  private users: User[] = JSON.parse(
    fs.readFileSync("work/users.json", "utf8")
  );
  private doables: Doable[] = JSON.parse(
    fs.readFileSync("work/doables.json", "utf8")
  );
  private allocations: Case[] = [];

  constructor() {
    this.sortDoablesByDate(this.doables);
    const cases = this.groupDoablesByCase(this.doables);
    this.allocations = cases;
  }

  private sortByDate(a: Doable, b: Doable) {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }

  private sortDoablesByDate(doables: Doable[]) {
    const sortedDoables = doables.sort((a, b) => this.sortByDate(a, b));
    this.doables = sortedDoables;
  }

  private groupDoablesByCase(doables: Doable[]): Case[] {
    const groupedDoables = doables.reduce((acc, doable) => {
      const { case_id } = doable;
      if (!case_id)
        return { ...acc, no_case: [...(acc["no_case"] ?? []), doable] };
      if (!(case_id in acc)) return { ...acc, [case_id]: [doable] };
      const doables = acc[case_id];
      return { ...acc, [case_id]: [...doables, doable] };
    }, {} as Record<string, Doable[]>);

    return Object.entries(groupedDoables).map(([case_id, doables]) => ({
      case_id,
      doables,
    }));
  }

  getAllocation(): Case {
    return this.allocations[0];
  }

  getAllocations(): Case[] {
    return this.allocations;
  }

  getDoablesForUser(userName: string): Doable[] {
    const user = this.users.find(({ user_name }) => user_name === userName);
    if (!user) throw new Error("User not found");

    const allocationDoables = this.getAllocation().doables;

    const doables = allocationDoables.filter(
      (doable) => doable.type === user.preferred_doable_type
    );
    if (doables.length === 0) return allocationDoables;
    return doables;
  }
}

const workAllocator = new WorkAllocator();

const allocation = workAllocator.getAllocation();
const allocations = workAllocator.getAllocations();
const doablesForUser = workAllocator.getDoablesForUser("terry.tasks");

console.log("Most important:", allocation);
console.log("All allocations:", allocations);
console.log("Doables for terry.tasks:", doablesForUser);
