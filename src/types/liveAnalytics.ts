export interface LiveAnalyticsSystem {
    load_1m: number;
    load_5m: number;
    load_15m: number;
    cpu_count: number;
    load_per_core_pct: number | null;
    mem_total_bytes: number;
    mem_available_bytes: number;
    mem_used_pct: number | null;
    swap_total_bytes: number;
    swap_used_bytes: number;
    disk_total_bytes: number;
    disk_used_bytes: number;
    disk_used_pct: number | null;
    uptime_seconds: number;
}

export interface LiveAnalyticsNginx {
    active_connections: number | null;
    reading: number | null;
    writing: number | null;
    waiting: number | null;
}

export interface LiveAnalyticsFpm {
    active_processes: number | null;
    idle_processes: number | null;
    total_processes: number | null;
    max_active_processes: number | null;
    max_children_reached: number | null;
    listen_queue: number | null;
    max_listen_queue: number | null;
    slow_requests: number | null;
    accepted_conn: number | null;
}

export interface LiveAnalyticsRedis {
    used_memory_bytes: number;
    used_memory_peak_bytes: number;
    mem_fragmentation_ratio: number;
    connected_clients: number;
    ops_per_sec: number;
    keyspace_hits: number;
    keyspace_misses: number;
}

export interface LiveAnalyticsMysql {
    threads_connected: number;
    threads_running: number;
    queries_per_sec: number;
    slow_queries_total: number;
    innodb_buffer_pool_used_pct: number | null;
}

export interface LiveAnalyticsReverb {
    total: number;
    [portKey: string]: number;
}

export interface LiveAnalyticsUsers {
    active_total: number;
    active_web: number;
    active_mobile: number;
    active_other: number;
    active_window_minutes: number;
    avg_session_age_seconds: number;
}

export interface LiveAnalyticsLiveClass {
    id: number;
    name: string;
    started_at: string | null;
    ends_at: string | null;
    participants: number;
}

export interface LiveAnalyticsLiveClasses {
    active_count: number;
    total_participants: number;
    classes: LiveAnalyticsLiveClass[];
}

export interface LiveAnalyticsTests {
    tracked_in_redis: number;
    log_window_seconds: number;
    distinct_users_in_log: number;
    requests_in_log: number;
    instrumentation_note: string | null;
}

export interface LiveAnalyticsQueues {
    total: number;
    [queueName: string]: number;
}

export interface LiveAnalyticsRequestRate {
    requests_last_60s?: number;
    rps?: number;
    error?: string;
}

export interface LiveAnalyticsActivity {
    id: number;
    log_name: string | null;
    description: string | null;
    subject_type: string | null;
    subject_id: number | null;
    causer_type: string | null;
    causer_id: number | null;
    created_at: string;
}

export interface LiveAnalyticsData {
    generated_at: string;
    system: LiveAnalyticsSystem | null;
    nginx: LiveAnalyticsNginx | null;
    fpm: LiveAnalyticsFpm | null;
    redis: LiveAnalyticsRedis | null;
    mysql: LiveAnalyticsMysql | null;
    reverb: LiveAnalyticsReverb | null;
    users: LiveAnalyticsUsers | null;
    live_classes: LiveAnalyticsLiveClasses | null;
    tests: LiveAnalyticsTests | null;
    queues: LiveAnalyticsQueues | null;
    request_rate: LiveAnalyticsRequestRate | null;
    recent_activity: LiveAnalyticsActivity[] | null;
}

export interface LiveAnalyticsResponse {
    status: number;
    message: string;
    data: LiveAnalyticsData;
}
