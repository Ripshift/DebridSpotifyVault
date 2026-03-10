export interface TrackInfo {
  name: string;
  artists: { name: string }[];
  album?: { name: string };
}

export interface Tracker {
  id: string;
  name: string;
  url: string;
}

export const AVAILABLE_TRACKERS: Tracker[] = [
  // Popular HTTP trackers
  { id: 'opentrackr', name: 'OpenTrackr', url: 'http://tracker.opentrackr.org:1337/announce' },
  { id: 'coppersurfer', name: 'Coppersurfer (UDP)', url: 'udp://tracker.coppersurfer.tk:6969/announce' },
  { id: 'kicks-ass', name: 'Kicks Ass', url: 'http://tracker.kicks-ass.net/announce' },
  { id: 'explodie', name: 'Explodie', url: 'http://explodie.org:6969/announce' },
  { id: 'pow7', name: 'Pow7', url: 'http://pow7.com:80/announce' },
  { id: 'torrent-gresille', name: 'Torrent Gresille', url: 'http://torrent.gresille.org/announce' },
  { id: 'tracker-internetwarriors', name: 'Internet Warriors', url: 'http://tracker.internetwarriors.net:1337/announce' },
  { id: 'tracker-leechers', name: 'Leechers Paradise (UDP)', url: 'udp://tracker.leechers-paradise.org:6969/announce' },
  { id: 'tracker-pirate', name: 'Pirate Public (UDP)', url: 'udp://tracker.piratepublic.com:1337/announce' },
  { id: 'tracker-skyts', name: 'SkyTS', url: 'http://tracker.skyts.net:6969/announce' },
  // More HTTP trackers
  { id: 'tracker-filetracker', name: 'FileTracker', url: 'http://tracker.filetracker.pl:8089/announce' },
  { id: 'tracker-flashtorrents', name: 'FlashTorrents', url: 'http://tracker.flashtorrents.org:6969/announce' },
  { id: 'tracker-mg64', name: 'MG64', url: 'http://tracker.mg64.net:6881/announce' },
  { id: 'tracker-tiny-vps', name: 'Tiny VPS', url: 'http://tracker.tiny-vps.com:6969/announce' },
  // Popular UDP trackers
  { id: 'rarbg-2710', name: 'RARBG (UDP)', url: 'udp://9.rarbg.com:2710/announce' },
  { id: 'zer0day', name: 'Zer0Day (UDP)', url: 'udp://zer0day.ch:1337/announce' },
  { id: 'open-stealth', name: 'Open Stealth (UDP)', url: 'udp://open.stealth.si:80/announce' },
  { id: 'shadowshq-eddie', name: 'ShadowSHQ Eddie (UDP)', url: 'udp://shadowshq.eddie4.nl:6969/announce' },
];

// UI defaults - which trackers are checked by default
export const DEFAULT_TRACKER_IDS = [
  'opentrackr',
  'coppersurfer',
  'kicks-ass',
  'explodie',
  'pow7',
  'tracker-leechers',
  'rarbg-2710',
];

export const search = async (
  track: TrackInfo,
  enabledTrackerIds: string[] = DEFAULT_TRACKER_IDS
): Promise<string | null> => {
  // Get enabled tracker URLs
  const enabledTrackers = AVAILABLE_TRACKERS.filter(t =>
    enabledTrackerIds.includes(t.id)
  );

  // TODO: implement real search across enabled tracker URLs
  // For now, return null (no magnet found)
  // In a real implementation, you'd:
  // 1. Build search queries for each tracker
  // 2. Make HTTP requests to tracker search endpoints
  // 3. Parse results and return a magnet link
  
  console.log(`Searching for "${track.name}" across ${enabledTrackers.length} trackers`);
  return null;
};
