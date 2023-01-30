<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::query();

        if ($search = $request->input('search')) {
            $query->whereRaw("title LIKE '%" .  $search . "%'")
                ->orWhereRaw("sub_title LIKE '%" .  $search . "%'");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->with('user:id,name')
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = News::where('id', $id)
                        ->with('user:id,name')
                        ->first();

        if (!$data) return $this->responseFailed('News not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'title' => 'required|string',
            'sub_title' => 'required|string',
            'description' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => Rule::in(['published', 'draft']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        if ($request->hasFile('image')) {
            $image = rand() . '.' . $request->image->getClientOriginalExtension();
            Storage::putFileAs('public/images', $request->file('image'), $image);
        }

        $data = News::create(array_merge(
            $validator->validated(),
            [
                'user_id' => auth()->user()->id,
                'slug' => Str::slug($request->title) . '-' . Str::uuid()->toString(),
                'tags' => json_encode($request->tags),
                'image' => $image ?? null,
            ]
        ));

        return $this->responseSuccess('News successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::where('id', $id)->first();
        if (!$news) return $this->responseFailed('News not found', '', 404);
        if ($news->status == 'published') return $this->responseFailed('News has been published', '', 422);

        $input = $request->all();
        $validator = Validator::make($input, [
            'title' => 'required|string',
            'sub_title' => 'required|string',
            'description' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => Rule::in(['published', 'draft']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $oldImage = $news->image;
        if ($request->hasFile('image')) {
            if (Storage::exists('public/images/' . $oldImage)) {
                Storage::delete('public/images/' . $oldImage);
            }
            $image = rand() . '.' . $request->image->getClientOriginalExtension();
            Storage::putFileAs('public/images', $request->file('image'), $image);
        } else {
            $image = $oldImage;
        }

        $news->update(array_merge(
            $validator->validated(),
            [
                'tags' => json_encode($request->tags),
                'image' => $image,
            ]
        ));

        $data = News::find($id);

        return $this->responseSuccess('News successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $news = News::where('id', $id)->first();
        if (!$news) return $this->responseFailed('News not found', '', 404);

        if ($news->image) {
            if (Storage::exists('public/images/' . $news->image)) {
                Storage::delete('public/images/' . $news->image);
            }
        }

        $news->delete();

        return $this->responseSuccess('News successfully deleted');
    }

    public function updateStatus(Request $request, $id)
    {
        $news = News::where('id', $id)->first();
        if (!$news) return $this->responseFailed('News not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'status' => Rule::in(['published', 'draft']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $news->update($validator->validated());

        return $this->responseSuccess('News status succesfully updated');
    }
}
