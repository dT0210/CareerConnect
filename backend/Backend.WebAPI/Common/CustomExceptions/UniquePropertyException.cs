namespace Backend.WebAPI.Common.CustomException;

public class UniquePropertyException : Exception
{
    public UniquePropertyException()
    {
    }

    public UniquePropertyException(string message)
        : base(message)
    {
    }

    public UniquePropertyException(string message, Exception inner)
        : base(message, inner)
    {
    }
}