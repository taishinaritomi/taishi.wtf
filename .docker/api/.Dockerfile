FROM rust:1.80.0

WORKDIR /app

COPY ./apps/api /app/apps/api
COPY ./Cargo.toml /app/Cargo.toml
COPY ./Cargo.lock /app/Cargo.lock

RUN apt-get update && apt-get install -y libvips-dev

RUN cargo build --release

CMD ["/app/target/release/taishi-wtf-api"]
