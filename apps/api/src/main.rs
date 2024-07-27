use std::time::Instant;

use anyhow::Context;
use axum::{http::header, response::IntoResponse, routing::get, Router};
use clap::Parser;
use dotenvy::dotenv;
use resvg::usvg;
use svg::{
    node::element::{path::Data, Path, Text},
    Document,
};

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
    let app = Router::new().route("/", get(create_svg));

    // run our app with hyper, listening globally on port 3000
    let addr = format!("0.0.0.0:{}", config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

fn txt(x: usize, y: usize, text: &str) -> Text {
    Text::new(text)
        .set("x", x)
        .set("y", y)
        .set("fill", "black")
        .set("font-size", 20)
        .set("dominant-baseline", "central") // 上下中央揃え
        .set("text-anchor", "middle") // 左右中央揃え
}

async fn create_svg() -> impl IntoResponse {
    let data = Data::new()
        .move_to((100, 100))
        .line_by((0, 500))
        .line_by((500, 0))
        .line_by((0, -500))
        .close();

    let path = Path::new()
        .set("fill", "none")
        .set("stroke", "red")
        .set("stroke-width", 3)
        .set("d", data);

    let document = Document::new()
        .set("viewBox", (0, 0, 1000, 1000))
        .set("width", 1000)
        .set("height", 1000)
        .add(path)
        .add(txt(25, 25, "vvv"));

    let start = Instant::now();

    let c = load_svg(&document.to_string()).unwrap();
    let duration = start.elapsed();
    println!("load_svg() is: {:?}", duration);

    ([(header::CONTENT_TYPE, "image/png")], c)
}

fn load_svg(svg: &str) -> anyhow::Result<Vec<u8>> {
    let tree = usvg::Tree::from_str(svg, &usvg::Options::default())?;

    let mut pixel = resvg::tiny_skia::Pixmap::new(
        tree.size().width().round() as u32,
        tree.size().height().round() as u32,
    )
    .context("Failed to create pixmap")?;

    resvg::render(
        &tree,
        resvg::tiny_skia::Transform::identity(),
        &mut pixel.as_mut(),
    );

    let data = pixel.encode_png()?;

    Ok(data)
}
