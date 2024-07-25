use axum::{routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;

#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env, hide_env_values = true)]
    pub port: u16,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let config = Config::parse();

    // build our application with a single route
    let app = Router::new().route("/", get(|| async { "Taishi Naritomi" }));

    // run our app with hyper, listening globally on port 3000
    let addr = format!("{}:{}", "0.0.0.0", config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
