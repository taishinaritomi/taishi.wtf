use anyhow::Ok;
use axum::{routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;
use image_handler::image_handler;
use tokio::net::TcpListener;

mod image_handler;

#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env)]
    pub port: u16,

    #[arg(long, env, default_value = "0.0.0.0")]
    pub host: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    let config = Config::parse();

    let addr = format!("{}:{}", config.host, config.port);
    let listener = TcpListener::bind(&addr).await?;

    let app = Router::new().route("/", get(image_handler));

    axum::serve(listener, app).await?;

    Ok(())
}
