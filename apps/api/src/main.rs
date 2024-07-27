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
    let app = Router::new().route(
        "/",
        get(|| async {
            "Hello 3"
            // let mut headers = HeaderMap::new();
            // headers.insert(header::CONTENT_TYPE, "image/svg+xml".parse().unwrap());

            // (headers, create_svg())
        }),
    );

    // run our app with hyper, listening globally on port 3000
    let addr = format!("0.0.0.0:{}", config.port);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// fn create_svg() {
//     let data = Data::new()
//         .move_to((10, 10))
//         .line_by((0, 50))
//         .line_by((50, 0))
//         .line_by((0, -50))
//         .close();

//     let path = Path::new()
//         .set("fill", "none")
//         .set("stroke", "red")
//         .set("stroke-width", 3)
//         .set("d", data);

//     let document = Document::new().set("viewBox", (0, 0, 70, 70)).add(path);

//     println!("{}", document.to_string());
// }
