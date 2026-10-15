interface ContextData {
  [year: number]: {
    title: string;
    description: string;
  };
}

export const POLITICAL_CONTEXT_DATA: ContextData = {
  1996: {
    title: "Post-Coup Election & APRC's Rise",
    description: "This was the first election held after the 1994 military coup led by Yahya Jammeh. It marked the transition from military to civilian rule, with Jammeh winning as the candidate for the newly formed Alliance for Patriotic Reorientation and Construction (APRC) party."
  },
  2001: {
    title: "Incumbent Consolidation",
    description: "Yahya Jammeh secured his second term in an election that saw a strong challenge from the United Democratic Party's (UDP) Ousainou Darboe. The political landscape was largely dominated by these two figures, solidifying the APRC's control."
  },
  2006: {
    title: "Opposition Boycott & Low Turnout",
    description: "This election was marked by a partial opposition boycott and the lowest voter turnout in this period (58.7%). Jammeh's APRC won by a landslide, further consolidating its power amid reduced electoral competition."
  },
  2011: {
    title: "APRC Dominance Continues",
    description: "Amidst concerns from the international community about the electoral process, Yahya Jammeh won a fourth term with over 71% of the vote, showcasing the APRC's deep-rooted political control and the fragmentation of the opposition."
  },
  2016: {
    title: "The Grand Coalition & Historic Upset",
    description: "A historic moment where seven opposition parties formed 'Coalition 2016' to field a single candidate, Adama Barrow. This united front successfully defeated the 22-year incumbent rule of Yahya Jammeh, signaling a major political shift."
  },
  2021: {
    title: "Barrow's Re-election with New Party",
    description: "After the 2016 coalition dissolved, President Adama Barrow formed his own party, the National People's Party (NPP). He won his first term as the NPP candidate, defeating his former ally and main rival, Ousainou Darboe of the UDP."
  }
};
