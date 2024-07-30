namespace Backend.WebAPI.Common.CustomException;

public class ActionNotAllowedException : Exception
{
    public ActionNotAllowedException()
    {
    }

    public ActionNotAllowedException(string message)
        : base(message)
    {
    }

    public ActionNotAllowedException(string message, Exception inner)
        : base(message, inner)
    {
    }
}