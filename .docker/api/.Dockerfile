FROM rust:1.77.2

WORKDIR /app

COPY ./api /app/api
COPY ./Cargo.toml /app/Cargo.toml
COPY ./Cargo.lock /app/Cargo.lock

RUN cargo build --release

CMD ["/app/target/release/taishi-wtf-api"]
