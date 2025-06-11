""""""

from datetime import datetime, timedelta
import tinydb  # type:ignore


class Log:
    """Creates and uses a database for log persistence"""

    def __init__(self, file):
        self.db = tinydb.TinyDB(file)

    def add_entry(self, obj):
        """Add a log entry"""
        # create a variable to hold the particular line
        doc = {"value": obj}

        # add a timestamp
        doc["created_at"] = datetime.isoformat(datetime.now())
        self.db.insert(doc)

    def clean_older(self, amt=1000):
        """Keep only a selected number of records from the last year. Delete others."""

        def older_than_days(d_isoformat, days):
            d = datetime.fromisoformat(d_isoformat)
            age = timedelta(days=days)
            now = datetime.now()
            return d < (now - age)

        self.db.remove(tinydb.Query().created_at.test(older_than_days, 365))

        max_length = amt
        if len(self.db) > max_length:
            # sort in reverse order (oldest first)
            sorted_records = sorted(
                self.db.all(), key=lambda k: k["created_at"], reverse=True
            )
            for r in sorted_records[max_length:]:
                self.db.remove(tinydb.Query().isodatetime == r["created_at"])
                print(f"created_at {r['created_at']}")

    def get_log(self, n=1000):
        """Return the last n log entries"""
        # sort in forward order (newest first)
        sorted_records = sorted(self.db.all(), key=lambda k: k["created_at"])
        return sorted_records[-n::]


if __name__ == "__main__":
    from pprint import pprint

    log = Log("log.db")
    log.add({"testobject": True})
    pprint(log.db.all())
