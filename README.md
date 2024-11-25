# Setup

1. Run `npm i`
2. Run `npm run start`
3. To test, run `npm run test`

## Notes

For this, I chose to keep it simple and just use a class that consumed and parsed the JSON, with public methods exposed to retrieve the single most important allocation, all prioritised allocations and a method to get all doables for a user for the most important piece of work currently in the system.

This could have been a singleton, but I wasn't sure if we wanted to use and extend this in other areas.

If I'm being honest, I was a little confused by the wording of the tasks, i.e. "For a given user, only return doables matching the user’s preferred doable type" - how does this relate to allocations? I've interpreted this as providing another method to get all doables from the highest priority allocation/case for a given user, but this might be wrong.

Tests are also pretty rudimentary - I'd like to extend more edge cases and code branches if I had more time.

## Usage

`workAllocator.getAllocation()` - get the case with the highest priority piece of work
`workAllocator.getAllocations()` - get all pieces of work, prioritised
`workAllocator.getDoablesForUser("emma.emails")` - get doables for a given user for the most important piece of work

## Assumptions

There's a doable with a missing case_id in `doables.json`, so when reducing doables down to respective cases, I've added an additional "no_case" key here, to hold doables with no case. We may want to handle this differently - either by reporting an error or prioritising case doables first.

Likewise, I'm taking allocation to essentially mean a list of doables from a case, but this is probably wrong - like I said, a bit confused by the task wording.

If instead the wording of the task ("Group all the doables for a case together into a single allocation and return these in a priority order") meant to weigh doables off against eachother based on the context of other doables in that case, we could do something like calculate an average doable `created_time` for each case, and return the _oldest_ doable from the case that has the _oldest_ average doable `created_time`.

We could adjust the heuristics of this algorithm if we wanted, i.e. adding weight to cases with particularly old doables, which could be more likely to have frustrated end-users than those cases with an older _average_ created time.
