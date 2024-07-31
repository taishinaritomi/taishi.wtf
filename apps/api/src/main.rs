use axum::{http::header, response::IntoResponse, routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;
use tiny_skia::Pixmap;
#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env, hide_env_values = true)]
    pub port: u16,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let config = Config::parse();

    let app = Router::new().route("/", get(index_handler));
    let addr = format!("0.0.0.0:{}", config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn index_handler() -> impl IntoResponse {
    let pixel = Pixmap::new(2000, 2000).unwrap();

    println!("size={}", pixel.data().len());

    let data = pixel.encode_png().unwrap();

    println!("encoded: size={}", data.len());

    ([(header::CONTENT_TYPE, "image/png")], data)
}
