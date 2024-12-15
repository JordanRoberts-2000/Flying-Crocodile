pub fn initialize_logger() {
    env_logger::builder()
        .format_module_path(false)
        .format_target(false)
        .format_timestamp(None)
        .init();
}
