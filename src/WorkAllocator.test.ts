import { WorkAllocator } from "./WorkAllocator";
import fs from "fs";

const mockUsers = [
  {
    user_name: "Alice",
    preferred_doable_type: "email",
  },
  {
    user_name: "Bob",
    preferred_doable_type: "task",
  },
  {
    user_name: "Charlie",
    preferred_doable_type: null,
  },
];

const doableOne = {
  id: "1",
  title: "Doable 2",
  case_id: "2",
  type: "task",
  created_at: "2021-01-05",
};

const doableTwo = {
  id: "2",
  title: "Doable 1",
  case_id: "1",
  type: "email",
  created_at: "2021-01-01",
};

const doableThree = {
  id: "3",
  title: "Doable 2",
  case_id: "2",
  type: "task",
  created_at: "2021-01-02",
};

const doableFour = {
  id: "4",
  title: "Doable 1",
  type: "email",
  created_at: "2021-01-03",
};
const mockDoables = [doableOne, doableTwo, doableThree, doableFour];

const fspSpy = jest.spyOn(fs, "readFileSync");

describe("WorkAllocator instance", () => {
  beforeEach(() => {
    fspSpy.mockReturnValueOnce(JSON.stringify(mockUsers));
    fspSpy.mockReturnValueOnce(JSON.stringify(mockDoables));
  });

  it("should return the most important allocation when calling getAllocation()", () => {
    const workAllocator = new WorkAllocator();
    const allocation = workAllocator.getAllocation();
    expect(allocation).toEqual({
      case_id: "1",
      doables: [doableTwo],
    });
  });

  it("should return a list of prioritsed allocations when calling getAllocations()", () => {
    const workAllocator = new WorkAllocator();
    const allocations = workAllocator.getAllocations();
    expect(allocations).toEqual([
      {
        case_id: "1",
        doables: [doableTwo],
      },
      {
        case_id: "2",
        doables: [doableThree, doableOne],
      },
      {
        case_id: "no_case",
        doables: [doableFour],
      },
    ]);
  });

  it("should return the most prioritised doables for a user when calling getDoablesForUser()", () => {
    const workAllocator = new WorkAllocator();
    const doables = workAllocator.getDoablesForUser("Alice");
    expect(doables).toEqual([doableTwo]);
  });
});
