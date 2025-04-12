def process_sales_data(sales_records, options=None):
    """Incomplete docstring - needs full documentation"""
    import datetime

    if options is None:
        options = {}

    default_options = {
        "start_date": None,
        "end_date": None,
        "region": None,
        "exclude_cancelled": True,
        "group_by": None,
        "calculate_tax": False,
        "tax_rate": 0.08
    }

    # Merge options with defaults
    settings = {**default_options, **options}

    # Filter by date range if specified
    filtered_data = sales_records
    if settings["start_date"]:
        filtered_data = [
            record for record in filtered_data
            if datetime.datetime.strptime(record["date"], "%Y-%m-%d") >= settings["start_date"]
        ]

    if settings["end_date"]:
        filtered_data = [
            record for record in filtered_data
            if datetime.datetime.strptime(record["date"], "%Y-%m-%d") <= settings["end_date"]
        ]

    # Filter by region if specified
    if settings["region"]:
        filtered_data = [
            record for record in filtered_data
            if record["region"] == settings["region"]
        ]

    # Exclude cancelled orders if specified
    if settings["exclude_cancelled"]:
        filtered_data = [
            record for record in filtered_data
            if record["status"] != "cancelled"
        ]

    # Calculate tax if requested
    if settings["calculate_tax"]:
        for record in filtered_data:
            record["tax"] = round(record["amount"] * settings["tax_rate"], 2)
            record["total"] = record["amount"] + record["tax"]

    # Group the data if specified
    if settings["group_by"]:
        grouped_data = {}
        for record in filtered_data:
            key = record.get(settings["group_by"])
            if key not in grouped_data:
                grouped_data[key] = []
            grouped_data[key].append(record)

        # Calculate summary for each group
        result = []
        for key, group in grouped_data.items():
            total_amount = sum(record["amount"] for record in group)
            total_quantity = sum(record["quantity"] for record in group)
            group_summary = {
                settings["group_by"]: key,
                "total_amount": total_amount,
                "total_quantity": total_quantity,
                "record_count": len(group),
                "records": group
            }
            result.append(group_summary)
        return result

    return filtered_data