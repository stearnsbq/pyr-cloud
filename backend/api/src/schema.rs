table! {
    function (id) {
        id -> Int4,
        name -> Varchar,
        runtime -> Varchar,
        codepath -> Varchar,
        resource -> Int4,
    }
}

table! {
    resource (id) {
        id -> Int4,
        route -> Varchar,
        method -> Varchar,
        parent -> Int4,
        function -> Int4,
    }
}

table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        password -> Varchar,
    }
}

allow_tables_to_appear_in_same_query!(
    function,
    resource,
    users,
);
